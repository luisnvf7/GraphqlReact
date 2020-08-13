const grapqhl = require('graphql')

const Book = require('../models/book')
const Author = require('../models/author')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, 
    GraphQLInt, GraphQLList, GraphQLNonNull } = grapqhl

//Tenemos dos object types (Books y authors)

const BookType = new GraphQLObjectType({
    //El name es para hacer referencia a ese libro en el front
    name: 'Book',
    //Son los atributos de dicho object type
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        //Aqui se hace una relacion, en donde retorna un AuthorType
        author: {
            type: AuthorType,
            //Es parent por la relacion, por eso no usa args
            resolve(parent, args) {
                console.log(parent)
                return Author.findById(parent.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books : {
            //Ya que sera un arreglo de BookTypes (retorna BookType)
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books.filter(elemento => elemento.authorId === parent.id )
                return Book.find({ authorId: parent.id })
            } 
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        //Query for a particular book
        //Query que se mostsrara en el front
        book: {
            //El tipo que retornara
            type: BookType,
            //Los argumentos que recibe la funcion (del tipo id ya que no se sabe si sera string o int)
            args: { id: { type: GraphQLID } },
            //El resolve recibe la propiedad args
            resolve(parent, args) {
                //code to get data from db / other source
                // return books.find((element) => element.id == args.id )
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // return authors.find((element) => element.id == args.id)
                return Author.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve (parent, args) {
                // return books
                return Book.find()
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
                return Author.find()
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAutor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                //Modelo de mongoose
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })

                return book.save()
            } 
        }
    }

})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})